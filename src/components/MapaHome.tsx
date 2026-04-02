import AsyncStorage from "@react-native-async-storage/async-storage";
import Mapbox from "@rnmapbox/maps";
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

import { api } from "@/src/services/api";

const mapboxToken = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

if (mapboxToken) {
  Mapbox.setAccessToken(mapboxToken);
}

type TipoUsuario = "DOADOR" | "COLETOR";

type Coordenada = {
  latitude: number;
  longitude: number;
};

type MapaHomeResponse = {
  success?: boolean;
  trackingAtivo?: boolean;
  tipoUsuario?: TipoUsuario;
  casaDoador?: {
    latitude: number;
    longitude: number;
    referencia?: string;
    bairro?: string;
    cidade?: string;
  } | null;
  localizacaoColetor?: {
    latitude: number;
    longitude: number;
  } | null;
  coletaAceita?: {
    id?: number;
    latitude?: number;
    longitude?: number;
    referencia?: string;
    bairro?: string;
    cidade?: string;
  } | null;
};

type Props = {
  tipoUsuario?: TipoUsuario;
  onAcaoPrincipal?: () => void;
};

const ROTA_DOACAO = "/doacao/casa";
const ROTA_COLETAS = "/coletas";

export default function MapaHome({
  tipoUsuario: tipoUsuarioProp,
  onAcaoPrincipal,
}: Props) {
  const cameraRef = useRef<Mapbox.Camera>(null);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [trackingAtivo, setTrackingAtivo] = useState(false);

  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>(
    tipoUsuarioProp || "DOADOR"
  );

  const [minhaLocalizacao, setMinhaLocalizacao] = useState<Coordenada | null>(null);
  const [localizacaoColetor, setLocalizacaoColetor] = useState<Coordenada | null>(null);
  const [casaDoador, setCasaDoador] = useState<Coordenada | null>(null);
  const [rotaGeoJSON, setRotaGeoJSON] = useState<any>(null);

  const destinoDescricao = useMemo(() => {
    if (!trackingAtivo) return "Sem coleta ativa";
    return "Casa do doador";
  }, [trackingAtivo]);

  const coletorDescricao = useMemo(() => {
    if (!localizacaoColetor) return "Coletor ainda não localizado";
    return "Coletor em tempo real";
  }, [localizacaoColetor]);

  const carregarTipoUsuario = useCallback(async () => {
    if (tipoUsuarioProp) {
      setTipoUsuario(tipoUsuarioProp);
      return;
    }

    try {
      const tipoSalvo = await AsyncStorage.getItem("tipoUsuario");

      if (tipoSalvo === "COLETOR" || tipoSalvo === "DOADOR") {
        setTipoUsuario(tipoSalvo);
        return;
      }

      if (tipoSalvo === "CLIENTE") {
        setTipoUsuario("DOADOR");
        return;
      }

      setTipoUsuario("DOADOR");
    } catch (error) {
      console.log("Erro ao carregar tipo do usuário:", error);
      setTipoUsuario("DOADOR");
    }
  }, [tipoUsuarioProp]);

  const enviarMinhaLocalizacao = useCallback(
    async (coords: Coordenada) => {
      if (tipoUsuario !== "COLETOR") return;

      try {
        await api.post("/doacoes/minha-localizacao", {
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      } catch (error) {
        console.log("Erro ao enviar localização:", error);
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

      if (tipoUsuario === "COLETOR") {
        await enviarMinhaLocalizacao(coords);
      }

      return coords;
    } catch (error) {
      console.log("Erro ao pegar localização:", error);
      setErro("Não foi possível obter sua localização.");
      return null;
    }
  }, [enviarMinhaLocalizacao, tipoUsuario]);

  const carregarDadosBackend = useCallback(async () => {
    try {
      const response = await api.get<MapaHomeResponse>("/doacoes/mapa/home");
      const data = response.data;

      setTrackingAtivo(!!data.trackingAtivo);

      if (data.casaDoador?.latitude && data.casaDoador?.longitude) {
        setCasaDoador({
          latitude: Number(data.casaDoador.latitude),
          longitude: Number(data.casaDoador.longitude),
        });
      } else if (data.coletaAceita?.latitude && data.coletaAceita?.longitude) {
        setCasaDoador({
          latitude: Number(data.coletaAceita.latitude),
          longitude: Number(data.coletaAceita.longitude),
        });
      } else {
        setCasaDoador(null);
      }

      if (
        data.localizacaoColetor?.latitude &&
        data.localizacaoColetor?.longitude
      ) {
        setLocalizacaoColetor({
          latitude: Number(data.localizacaoColetor.latitude),
          longitude: Number(data.localizacaoColetor.longitude),
        });
      } else {
        setLocalizacaoColetor(null);
      }

      setErro("");
    } catch (error) {
      console.log("Erro ao carregar dados do mapa:", error);
      setErro("Não foi possível carregar os dados do mapa.");
    }
  }, []);

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

    if (tipoUsuario === "DOADOR" && casaDoador && localizacaoColetor) {
      cameraRef.current.fitBounds(
        [localizacaoColetor.longitude,     localizacaoColetor.latitude],
        [casaDoador.longitude,   casaDoador.latitude],
        80,
        1000
      );
      return;
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
    }
  }, [tipoUsuario, minhaLocalizacao, casaDoador, localizacaoColetor]);

  const atualizarTudo = useCallback(async () => {
    await carregarTipoUsuario();
    await pegarLocalizacao();
    await carregarDadosBackend();
  }, [carregarTipoUsuario, pegarLocalizacao, carregarDadosBackend]);

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
      const timeout =   setTimeout(() => {
        centralizarMapa();
      }, 700);

      return () =>    clearTimeout(timeout);
    }
  }, [loading, centralizarMapa, rotaGeoJSON]);

  const textoStatus = useMemo(() => {
    if (loading) return "Carregando mapa...";
    if (erro) return erro;

    if (!trackingAtivo) {
      return tipoUsuario === "COLETOR"
        ? "Nenhuma coleta aceita no momento."
        : "Nenhuma coleta ativa no momento.";
    }

    return tipoUsuario === "DOADOR"
      ? "Acompanhe o coletor em tempo real."
      : "Siga a rota até a casa do doador.";
  }, [loading, erro, trackingAtivo, tipoUsuario]);

  const tituloMapa = useMemo(() => {
    if (tipoUsuario === "COLETOR") return "Mapa do coletor";
    return "Mapa do doador";
  }, [tipoUsuario]);

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
      <View style={styles.infoCardTop}>
        <Text style={styles.infoTitle}>{tituloMapa}</Text>
        <Text style={styles.infoSubtitle}>{textoStatus}</Text>
      </View>

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

        {casaDoador && (
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

        {tipoUsuario === "COLETOR" && trackingAtivo && (
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

  infoCardTop: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    zIndex: 20,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },

  infoSubtitle: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
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
    zIndex: 20,
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