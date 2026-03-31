module.exports = {
  expo: {
    name: "Recicle+",
    slug: "recicleplus",
    version: "1.0.1",
    orientation: "portrait",
    scheme: "recicleplus",
    userInterfaceStyle: "automatic",
    assetBundlePatterns: ["**/*"],
    newArchEnabled: true,

    android: {
      package: "com.recicleplus.app",
      usesCleartextTraffic: true,
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "INTERNET"
      ]
    },

    plugins: [
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOADS_TOKEN
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