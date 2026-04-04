module.exports = {
  expo: {
    name: "Recicle+",
    slug: "recicleplus",
    version: "1.0.4",
    orientation: "portrait",
    scheme: "recicleplus",
    userInterfaceStyle: "automatic",
    assetBundlePatterns: ["**/*"],
    newArchEnabled: true,

    icon: "./assets/icon.png",

    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#80C865"
    },

    android: {
      package: "com.recicleplus.app",
      usesCleartextTraffic: true,
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "INTERNET"
      ],
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#80C865"
      }
    },

    plugins: [
      "expo-router",
      [
        "@rnmapbox/maps",
        {
          RNMAPBOX_MAPS_DOWNLOAD_TOKEN: process.env.MAPBOX_DOWNLOADS_TOKEN
        }
      ],
      [
        "expo-location",
        {
          locationWhenInUsePermission:
            "Permitir que o Recicle+ acesse sua localização enquanto você usa o app."
        }
      ]
    ],

    extra: {
      eas: {
        projectId: "7bb1d3a9-701f-485a-bdef-c28de5464a7b"
      }
    }
  }
};