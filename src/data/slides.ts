export type Slide = {
  titulo: string;
  descricao: string;
  imagem: {
    uri: string;
  };
};

export const slides: Slide[] = [
  {
    titulo: "🌍 Bem-vindo ao Recicle+",
    descricao: "Um jeito moderno e eficiente de ajudar o planeta com reciclagem.",
    imagem: {
      uri: "https://cdn-icons-png.flaticon.com/512/3607/3607444.png"
    }
  },
  {
    titulo: "🧤 Doe com Facilidade",
    descricao: "Cadastre seus recicláveis e agende a coleta diretamente pelo app.",
    imagem: {
      uri: "https://img.freepik.com/vetores-gratis/sinal-de-reciclagem-verde-ao-redor-da-terra_78370-848.jpg"
    }
  },
  {
    titulo: "🚛 Colete com Propósito",
    descricao: "Ajude a coletar doações, ganhe pontos e faça parte da mudança.",
    imagem: {
      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJIPhqhxbIbFsfXLX6x8bHrn4WlxIFjinT31RMPM4Upa1CgXWOx_SQS5oxI4OLaVFk6NE&usqp=CAU"
    }
  },
  {
    titulo: "✨ Pronto para Começar?",
    descricao: "Entre agora e aproveite tudo que o Recicle+ tem para oferecer.",
    imagem: {
      uri: "https://i.pinimg.com/236x/53/c2/bc/53c2bc05091f9076add13611358f6620.jpg"
    }
  }
];
