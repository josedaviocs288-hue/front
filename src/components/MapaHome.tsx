import AsyncStorage from "@react-native-async-storage/async-storage";
import Mapbox from "@rnmapbox/maps";
import { Client } from "@stomp/stompjs";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { subscribeAtualizacaoGlobal } from "@/src/utils/appEvents";
import { api } from "@/src/services/api";

const mapboxToken = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
const wsUrl = process.env.EXPO_PUBLIC_WS_URL;

if (mapboxToken) {
  Mapbox.setAccessToken(mapboxToken);
}

type TipoUsuario = "DOADOR" | "COLETOR";

type StatusDoacao =
  | "PENDENTE"
  | "ACEITA"
  | "EM_ROTA"
  | "AGUARDANDO_CONFIRMACAO"
  | "CONCLUIDA"
  | "CANCELADA"
  | string;

type Coordenada = {
  latitude: number;
  longitude: number;
};

type DoacaoMapaItem = {
  id: number;
  latitude: number;
  longitude: number;
  referencia?: string;
  bairro?: string;
  cidade?: string;
  rua?: string;
  numero?: string;
  materiais?: string;
  status?: StatusDoacao;
  doadorNome?: string;
  doadorEmail?: string;
  coletorNome?: string;
  coletorEmail?: string;
};

type DoacoesApiResponse = {
  success?: boolean;
  message?: string;
  data?: DoacaoMapaItem[];
};

type RastreamentoData = {
  doacaoId: number;
  status?: string;
  coletorLatitude?: number | null;
  coletorLongitude?: number | null;
  doadorLatitude?: number | null;
  doadorLongitude?: number | null;
  referencia?: string;
  bairro?: string;
  cidade?: string;
  rua?: string;
  numero?: string;
};

type RastreamentoApiResponse = {
  success?: boolean;
  message?: string;
  data?: RastreamentoData;
};

type LocalizacaoWSMessage = {
  doacaoId?: number;
  coletaId?: number;
  latitude?: number;
  longitude?: number;
  coletorLatitude?: number;
  coletorLongitude?: number;
};

type Props = {
  tipoUsuario?: TipoUsuario;
  onAcaoPrincipal?: () => void;
  menuOpen?: boolean;
};

const ROTA_DOACAO = "/doacao/casa";
const ROTA_COLETAS = "/coletas";

function normalizarStatus(status?: string | null): string {
  return String(status || "").trim().toUpperCase();
}

function isStatusAtivoMapa(status?: string | null): boolean {
  const s = normalizarStatus(status);
  return (
    s === "PENDENTE" ||
    s === "ACEITA" ||
    s === "EM_ROTA" ||
    s === "AGUARDANDO_CONFIRMACAO"
  );
}

export default function MapaHome({
  tipoUsuario: tipoUsuarioProp,
  onAcaoPrincipal,
  menuOpen = false,
}: Props) {
  const cameraRef = useRef<any>(null);
  const wsClientRef = useRef<Client | null>(null);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [trackingAtivo, setTrackingAtivo] = useState(false);

  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>(
    tipoUsuarioProp || "DOADOR"
  );

  const [emailUsuario, setEmailUsuario] = useState<string | null>(null);
  const [doacaoAtivaId, setDoacaoAtivaId] = useState<number | null>(null);

  const [minhaLocalizacao, setMinhaLocalizacao] =
    useState<Coordenada | null>(null);
  const [localizacaoColetor, setLocalizacaoColetor] =
    useState<Coordenada | null>(null);
  const [casaDoador, setCasaDoador] = useState<Coordenada | null>(null);
  const [rotaGeoJSON, setRotaGeoJSON] = useState<any>(null);
  const [doacoesMapa, setDoacoesMapa] = useState<DoacaoMapaItem[]>([]);

  const destinoDescricao = useMemo(() => {
    if (tipoUsuario === "COLETOR") {
      if (trackingAtivo && casaDoador) return "Destino da coleta";
      return doacoesMapa.length > 0
        ? "Doações pendentes"
        : "Sem doações pendentes";
    }

    if (trackingAtivo && localizacaoColetor) {
      return "Coletor a caminho";
    }

    return doacoesMapa.length > 0
      ? "Doações disponíveis"
      : "Sem doações no mapa";
  }, [tipoUsuario, doacoesMapa, trackingAtivo, casaDoador, localizacaoColetor]);

  const coletorDescricao = useMemo(() => {
    if (!localizacaoColetor) return "Coletor ainda não localizado";
    return "Coletor em tempo real";
  }, [localizacaoColetor]);

  const carregarTipoUsuario = useCallback(async () => {
    let tipoResolvido: TipoUsuario = "DOADOR";
    let emailResolvido: string | null = null;

    if (tipoUsuarioProp) {
      tipoResolvido = tipoUsuarioProp;
      setTipoUsuario(tipoUsuarioProp);
    } else {
      try {
        const tipoSalvo =
          (await AsyncStorage.getItem("tipoUsuario")) ||
          (await AsyncStorage.getItem("@tipoUsuario")) ||
          (await AsyncStorage.getItem("tipo"));

        if (tipoSalvo === "COLETOR" || tipoSalvo === "DOADOR") {
          tipoResolvido = tipoSalvo;
        } else if (tipoSalvo === "CLIENTE") {
          tipoResolvido = "DOADOR";
        } else {
          tipoResolvido = "DOADOR";
        }

        setTipoUsuario(tipoResolvido);
      } catch (error) {
        console.log("Erro ao carregar tipo do usuário:", error);
        tipoResolvido = "DOADOR";
        setTipoUsuario("DOADOR");
      }
    }

    try {
      const emailDireto =
        (await AsyncStorage.getItem("emailUsuario")) ||
        (await AsyncStorage.getItem("@emailUsuario"));
      const userJson = await AsyncStorage.getItem("@recicleplus_user");

      let emailDoUsuario: string | null = null;

      try {
        emailDoUsuario = userJson ? JSON.parse(userJson)?.email || null : null;
      } catch {
        emailDoUsuario = null;
      }

      const emailSalvo = emailDireto || emailDoUsuario;
      emailResolvido = emailSalvo ? String(emailSalvo).toLowerCase() : null;
      setEmailUsuario(emailResolvido);
    } catch (error) {
      console.log("Erro ao carregar email do usuário:", error);
      emailResolvido = null;
      setEmailUsuario(null);
    }

    return {
      tipo: tipoResolvido,
      email: emailResolvido,
    };
  }, [tipoUsuarioProp]);

  const desconectarWebSocket = useCallback(() => {
    if (wsClientRef.current) {
      try {
        wsClientRef.current.deactivate();
      } catch (error) {
        console.log("Erro ao desconectar WS:", error);
      } finally {
        wsClientRef.current = null;
      }
    }
  }, []);

  const conectarWebSocket = useCallback(async () => {
    if (!doacaoAtivaId || !wsUrl) return;

    try {
      desconectarWebSocket();

      const token =
        (await AsyncStorage.getItem("@recicleplus_token")) ||
        (await AsyncStorage.getItem("token"));

      if (!token) {
        console.log("WS cancelado: token não encontrado.");
        return;
      }

      const client = new Client({
        brokerURL: wsUrl,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        debug: (msg) => console.log("WS:", msg),
      });

      client.onConnect = () => {
        console.log("📡 WebSocket conectado");

        if (tipoUsuario === "DOADOR") {
          client.subscribe(
            `/topic/coletas/${doacaoAtivaId}/localizacao`,
            (message) => {
              try {
                const data: LocalizacaoWSMessage = JSON.parse(message.body);

                const latitude = data.latitude ?? data.coletorLatitude ?? null;
                const longitude =
                  data.longitude ?? data.coletorLongitude ?? null;

                if (latitude !== null && longitude !== null) {
                  setLocalizacaoColetor({
                    latitude: Number(latitude),
                    longitude: Number(longitude),
                  });
                  setTrackingAtivo(true);
                }
              } catch (error) {
                console.log("Erro ao ler mensagem WS:", error);
              }
            }
          );
        }
      };

      client.onStompError = (frame) => {
        console.log("Erro STOMP:", frame.headers["message"]);
        console.log("Detalhes STOMP:", frame.body);
      };

      client.onWebSocketError = (event) => {
        console.log("Erro no WebSocket:", event);
      };

      client.activate();
      wsClientRef.current = client;
    } catch (error) {
      console.log("Erro ao conectar WS:", error);
    }
  }, [doacaoAtivaId, wsUrl, tipoUsuario, desconectarWebSocket]);

  const enviarMinhaLocalizacao = useCallback(
    async (coords: Coordenada, doacaoId: number | null) => {
      if (tipoUsuario !== "COLETOR" || !doacaoId) return;

      try {
        await api.post(`/rastreamento/${doacaoId}/coletor`, {
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        if (wsClientRef.current?.connected) {
          wsClientRef.current.publish({
            destination: `/app/coletas/${doacaoId}/localizacao`,
            body: JSON.stringify({
              latitude: coords.latitude,
              longitude: coords.longitude,
            }),
          });

          console.log("📍 Localização enviada via WS");
        } else {
          console.log("WS ainda não conectado para publicar localização");
        }
      } catch (error) {
        console.log("Erro ao enviar localização do coletor:", error);
      }
    },
    [tipoUsuario]
  );

  const pegarLocalizacao = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErro("Permissão de localização negada.");
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setMinhaLocalizacao(coords);
      return coords;
    } catch (error) {
      console.log("Erro ao pegar localização:", error);
      setErro("Não foi possível obter sua localização.");
      return null;
    }
  }, []);

  const selecionarDoacaoAtiva = useCallback(
    (lista: DoacaoMapaItem[], tipoAtual?: TipoUsuario, emailAtual?: string | null) => {
      const email = String(emailAtual ?? emailUsuario ?? "").toLowerCase();
      const tipo = tipoAtual ?? tipoUsuario;

      if (tipo === "COLETOR") {
        return (
          lista.find((item) => {
            const status = normalizarStatus(item.status);
            const coletorEmail = String(item.coletorEmail || "").toLowerCase();

            return (
              (status === "ACEITA" ||
                status === "EM_ROTA" ||
                status === "AGUARDANDO_CONFIRMACAO") &&
              coletorEmail === email
            );
          }) || null
        );
      }

      return (
        lista.find((item) => {
          const status = normalizarStatus(item.status);
          const doadorEmail = String(item.doadorEmail || "").toLowerCase();

          return (
            (status === "ACEITA" ||
              status === "EM_ROTA" ||
              status === "AGUARDANDO_CONFIRMACAO") &&
            doadorEmail === email
          );
        }) || null
      );
    },
    [tipoUsuario, emailUsuario]
  );

  const carregarRastreamento = useCallback(async (id: number) => {
    try {
      const response = await api.get<RastreamentoApiResponse>(
        `/rastreamento/${id}`
      );

      const data = response.data?.data;

      if (!data) return;

      const statusAtual = normalizarStatus(data.status);

      if (statusAtual === "CONCLUIDA" || statusAtual === "CANCELADA") {
        setTrackingAtivo(false);
        setLocalizacaoColetor(null);
        setCasaDoador(null);
        return;
      }

      setTrackingAtivo(true);

      if (
        data.doadorLatitude !== null &&
        data.doadorLatitude !== undefined &&
        data.doadorLongitude !== null &&
        data.doadorLongitude !== undefined
      ) {
        setCasaDoador({
          latitude: Number(data.doadorLatitude),
          longitude: Number(data.doadorLongitude),
        });
      } else {
        setCasaDoador(null);
      }

      if (
        data.coletorLatitude !== null &&
        data.coletorLatitude !== undefined &&
        data.coletorLongitude !== null &&
        data.coletorLongitude !== undefined
      ) {
        setLocalizacaoColetor({
          latitude: Number(data.coletorLatitude),
          longitude: Number(data.coletorLongitude),
        });
      } else {
        setLocalizacaoColetor(null);
      }

      setErro("");
    } catch (error) {
      console.log("Erro ao carregar rastreamento:", error);
      setTrackingAtivo(false);
      setLocalizacaoColetor(null);
      setCasaDoador(null);
    }
  }, []);

  const carregarDadosBackend = useCallback(
    async (
      contexto?: {
        tipo?: TipoUsuario;
        email?: string | null;
      }
    ) => {
      try {
        const response = await api.get<DoacoesApiResponse>("/doacoes");
        const lista = response.data?.data ?? [];

        const tipoAtual = contexto?.tipo ?? tipoUsuario;
        const emailAtual = String(contexto?.email ?? emailUsuario ?? "").toLowerCase();

        let doacoesFiltradas: DoacaoMapaItem[] = [];

        if (tipoAtual === "COLETOR") {
          doacoesFiltradas = lista.filter((item) => {
            const status = normalizarStatus(item.status);
            const coletorEmail = String(item.coletorEmail || "").toLowerCase();

            if (status === "CONCLUIDA" || status === "CANCELADA") {
              return false;
            }

            return (
              status === "PENDENTE" ||
              ((status === "ACEITA" ||
                status === "EM_ROTA" ||
                status === "AGUARDANDO_CONFIRMACAO") &&
                coletorEmail === emailAtual)
            );
          });
        } else {
          doacoesFiltradas = lista.filter((item) => {
            const doadorEmail = String(item.doadorEmail || "").toLowerCase();
            const status = normalizarStatus(item.status);

            if (status === "CONCLUIDA" || status === "CANCELADA") {
              return false;
            }

            return (
              doadorEmail === emailAtual &&
              (status === "PENDENTE" ||
                status === "ACEITA" ||
                status === "EM_ROTA" ||
                status === "AGUARDANDO_CONFIRMACAO")
            );
          });
        }

        setDoacoesMapa(doacoesFiltradas);

        const doacaoAtiva = selecionarDoacaoAtiva(lista, tipoAtual, emailAtual);

        if (doacaoAtiva?.id) {
          setDoacaoAtivaId(doacaoAtiva.id);
          await carregarRastreamento(doacaoAtiva.id);
        } else {
          setDoacaoAtivaId(null);
          setTrackingAtivo(false);
          setLocalizacaoColetor(null);
          setCasaDoador(null);
        }

        setErro("");
      } catch (error) {
        console.log("Erro ao carregar dados do mapa:", error);
        setErro("Não foi possível carregar os dados do mapa.");
      }
    },
    [tipoUsuario, emailUsuario, selecionarDoacaoAtiva, carregarRastreamento]
  );

  const buscarRota = useCallback(async () => {
    if (!mapboxToken || !minhaLocalizacao || !casaDoador) {
      setRotaGeoJSON(null);
      return;
    }

    try {
      const url =
        `https://api.mapbox.com/directions/v5/mapbox/driving/` +
        `${minhaLocalizacao.longitude},${minhaLocalizacao.latitude};` +
        `${casaDoador.longitude},${casaDoador.latitude}` +
        `?geometries=geojson&overview=full&access_token=${mapboxToken}`;

      const response = await fetch(url);
      const data = await response.json();

      const rota = data?.routes?.[0]?.geometry;

      if (rota) {
        setRotaGeoJSON({
          type: "Feature",
          properties: {},
          geometry: rota,
        });
      } else {
        setRotaGeoJSON(null);
      }
    } catch (error) {
      console.log("Erro ao buscar rota:", error);
      setRotaGeoJSON(null);
    }
  }, [minhaLocalizacao, casaDoador]);

  const centralizarMapa = useCallback(() => {
    if (!cameraRef.current) return;

    if (tipoUsuario === "COLETOR" && minhaLocalizacao && casaDoador) {
      cameraRef.current.fitBounds(
        [minhaLocalizacao.longitude, minhaLocalizacao.latitude],
        [casaDoador.longitude, casaDoador.latitude],
        80,
        1000
      );
      return;
    }

    if (tipoUsuario === "DOADOR" && localizacaoColetor && casaDoador) {
      cameraRef.current.fitBounds(
        [localizacaoColetor.longitude, localizacaoColetor.latitude],
        [casaDoador.longitude, casaDoador.latitude],
        80,
        1000
      );
      return;
    }

    if (doacoesMapa.length > 0) {
      const primeira = doacoesMapa[0];

      if (
        primeira.latitude !== undefined &&
        primeira.longitude !== undefined
      ) {
        cameraRef.current.setCamera({
          centerCoordinate: [
            Number(primeira.longitude),
            Number(primeira.latitude),
          ],
          zoomLevel: 13,
          animationDuration: 1200,
        });
        return;
      }
    }

    if (minhaLocalizacao) {
      cameraRef.current.setCamera({
        centerCoordinate: [
          minhaLocalizacao.longitude,
          minhaLocalizacao.latitude,
        ],
        zoomLevel: 14,
        animationDuration: 1200,
      });
      return;
    }

    cameraRef.current.setCamera({
      centerCoordinate: [-39.9167, -2.9248],
      zoomLevel: 12,
      animationDuration: 1200,
    });
  }, [tipoUsuario, minhaLocalizacao, casaDoador, localizacaoColetor, doacoesMapa]);

  const atualizarTudo = useCallback(async () => {
  await carregarTipoUsuario();
  const coords = await pegarLocalizacao();
  await carregarDadosBackend();

  if (tipoUsuario === "COLETOR" && coords && doacaoAtivaId) {
    await enviarMinhaLocalizacao(coords, doacaoAtivaId);
    await carregarRastreamento(doacaoAtivaId);
  }
}, [
  carregarTipoUsuario,
  pegarLocalizacao,
  carregarDadosBackend,
  tipoUsuario,
  doacaoAtivaId,
  enviarMinhaLocalizacao,
  carregarRastreamento,
]);

useEffect(() => {
  const unsubscribe = subscribeAtualizacaoGlobal(() => {
    atualizarTudo();
  });

  return unsubscribe;
}, [atualizarTudo]);

useEffect(() => {
  let mounted = true;

  async function iniciar() {
    setLoading(true);
    await atualizarTudo();
    if (mounted) setLoading(false);
  }

  iniciar();

  const interval = setInterval(() => {
    atualizarTudo();
  }, 5000);

  return () => {
    mounted = false;
    clearInterval(interval);
  };
}, [atualizarTudo]);

  useEffect(() => {
    if (
      doacaoAtivaId &&
      (tipoUsuario === "DOADOR" || tipoUsuario === "COLETOR")
    ) {
      conectarWebSocket();
    } else {
      desconectarWebSocket();
    }

    return () => {
      desconectarWebSocket();
    };
  }, [tipoUsuario, doacaoAtivaId, conectarWebSocket, desconectarWebSocket]);

  useEffect(() => {
    if (
      tipoUsuario === "COLETOR" &&
      trackingAtivo &&
      minhaLocalizacao &&
      casaDoador
    ) {
      buscarRota();
    } else {
      setRotaGeoJSON(null);
    }
  }, [buscarRota, tipoUsuario, trackingAtivo, minhaLocalizacao, casaDoador]);

  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        centralizarMapa();
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [loading, centralizarMapa, rotaGeoJSON, localizacaoColetor]);

  const textoStatus = useMemo(() => {
    if (loading) return "Carregando mapa...";
    if (erro) return erro;

    if (trackingAtivo) {
      return tipoUsuario === "COLETOR"
        ? "Você está a caminho da coleta."
        : "Coletor a caminho.";
    }

    if (doacoesMapa.length === 0) {
      return "";
    }

    return tipoUsuario === "COLETOR"
      ? `${doacoesMapa.length} doação(ões) pendente(s) no mapa.`
      : "Doações carregadas no mapa.";
  }, [loading, erro, doacoesMapa, tipoUsuario, trackingAtivo]);

  const textoBotaoPrincipal = useMemo(() => {
    return tipoUsuario === "COLETOR"
      ? "Veja as coletas do dia"
      : "Faça sua doação";
  }, [tipoUsuario]);

  const irParaAcaoPrincipal = useCallback(() => {
    if (tipoUsuario === "COLETOR") {
      router.push(ROTA_COLETAS as any);
      return;
    }

    router.push(ROTA_DOACAO as any);
  }, [tipoUsuario]);

  if (loading) {
    return (
      <View style={styles.fullScreenCenter}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando mapa...</Text>
      </View>
    );
  }

  if (erro && !minhaLocalizacao) {
    return (
      <View style={styles.fullScreenCenter}>
        <Text style={styles.errorText}>{erro}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={atualizarTudo}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        logoEnabled={false}
        scaleBarEnabled={false}
      >
        <Mapbox.Camera
          ref={cameraRef}
          zoomLevel={14}
          centerCoordinate={
            minhaLocalizacao
              ? [minhaLocalizacao.longitude, minhaLocalizacao.latitude]
              : [-39.9167, -2.9248]
          }
        />

        {rotaGeoJSON && tipoUsuario === "COLETOR" && (
          <Mapbox.ShapeSource id="rota-source" shape={rotaGeoJSON}>
            <Mapbox.LineLayer
              id="rota-linha"
              style={{
                lineColor: "#2563eb",
                lineWidth: 6,
                lineCap: "round",
                lineJoin: "round",
                lineOpacity: 0.9,
              }}
            />
          </Mapbox.ShapeSource>
        )}

        {minhaLocalizacao && (
          <Mapbox.PointAnnotation
            id="minha-localizacao"
            coordinate={[
              minhaLocalizacao.longitude,
              minhaLocalizacao.latitude,
            ]}
          >
            <View style={styles.markerWrapper}>
              <View style={styles.markerMe} />
            </View>
          </Mapbox.PointAnnotation>
        )}

        {!trackingAtivo &&
          doacoesMapa
            .filter((item) => isStatusAtivoMapa(item.status))
            .filter((item) => {
              const lat = Number(item.latitude);
              const lng = Number(item.longitude);
              return !Number.isNaN(lat) && !Number.isNaN(lng);
            })
            .map((item) => (
              <Mapbox.PointAnnotation
                key={`doacao-${item.id}`}
                id={`doacao-${item.id}`}
                coordinate={[Number(item.longitude), Number(item.latitude)]}
              >
                <View style={styles.markerWrapper}>
                  <View style={styles.markerHome} />
                </View>
              </Mapbox.PointAnnotation>
            ))}

        {trackingAtivo && casaDoador && (
          <Mapbox.PointAnnotation
            id="casa-doador"
            coordinate={[casaDoador.longitude, casaDoador.latitude]}
          >
            <View style={styles.markerWrapper}>
              <View style={styles.markerHome} />
            </View>
          </Mapbox.PointAnnotation>
        )}

        {tipoUsuario === "DOADOR" && localizacaoColetor && (
          <Mapbox.PointAnnotation
            id="localizacao-coletor"
            coordinate={[
              localizacaoColetor.longitude,
              localizacaoColetor.latitude,
            ]}
          >
            <View style={styles.markerWrapper}>
              <View style={styles.markerCollector} />
            </View>
          </Mapbox.PointAnnotation>
        )}
      </Mapbox.MapView>

      {!menuOpen && (
        <View style={styles.bottomPanel}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, styles.legendMe]} />
            <Text style={styles.legendText}>
              {tipoUsuario === "COLETOR" ? "Minha posição" : "Sua posição"}
            </Text>
          </View>

          <View style={styles.legendRow}>
            <View style={[styles.legendDot, styles.legendHome]} />
            <Text style={styles.legendText}>{destinoDescricao}</Text>
          </View>

          {tipoUsuario === "DOADOR" && (
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, styles.legendCollector]} />
              <Text style={styles.legendText}>{coletorDescricao}</Text>
            </View>
          )}

          {!!textoStatus && (
            <View style={styles.legendRow}>
              <Text style={styles.legendStatus}>{textoStatus}</Text>
            </View>
          )}

          {tipoUsuario === "COLETOR" && trackingAtivo && rotaGeoJSON && (
            <View style={styles.legendRow}>
              <View style={styles.routeLinePreview} />
              <Text style={styles.legendText}>Rota até o destino</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={onAcaoPrincipal || irParaAcaoPrincipal}
          >
            <Text style={styles.primaryActionText}>{textoBotaoPrincipal}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            onPress={centralizarMapa}
          >
            <Text style={styles.secondaryActionText}>Centralizar mapa</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const MARKER_SIZE = 18;
const OUTER_SIZE = 34;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },

  map: {
    flex: 1,
  },

  fullScreenCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f7fb",
    paddingHorizontal: 24,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
  },

  errorText: {
    fontSize: 16,
    color: "#b91c1c",
    textAlign: "center",
    marginBottom: 14,
  },

  retryButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },

  retryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  markerWrapper: {
    width: OUTER_SIZE,
    height: OUTER_SIZE,
    borderRadius: OUTER_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.96)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },

  markerMe: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    backgroundColor: "#2563eb",
    borderWidth: 3,
    borderColor: "#dbeafe",
  },

  markerHome: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    backgroundColor: "#dc2626",
    borderWidth: 3,
    borderColor: "#fee2e2",
  },

  markerCollector: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    backgroundColor: "#16a34a",
    borderWidth: 3,
    borderColor: "#dcfce7",
  },

  bottomPanel: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },

  legendMe: {
    backgroundColor: "#2563eb",
  },

  legendHome: {
    backgroundColor: "#dc2626",
  },

  legendCollector: {
    backgroundColor: "#16a34a",
  },

  legendText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },

  legendStatus: {
    fontSize: 13,
    color: "#4b5563",
    fontWeight: "600",
  },

  routeLinePreview: {
    width: 26,
    height: 6,
    borderRadius: 99,
    backgroundColor: "#2563eb",
    marginRight: 10,
  },

  primaryActionButton: {
    marginTop: 6,
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  primaryActionText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  secondaryActionButton: {
    marginTop: 10,
    backgroundColor: "#2563eb",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
  },

  secondaryActionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
});