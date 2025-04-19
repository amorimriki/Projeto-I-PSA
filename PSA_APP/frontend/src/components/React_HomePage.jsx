import React from "react";
import { Container, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../App.css";

import CustomNavbar from "./CustomNavBar";
import CustomFooter from "./CustomFooter";

function HomePage() {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-between">
      <Container fluid className="p-0">
        {/* NavBar */}
        <CustomNavbar />
        {/* Hero Section */}
        <section className="hero bg-primary text-white text-center py-5">
          <h1>Previsão de Sucesso Académico</h1>
          <p className="lead">
            Obtenha insights sobre seu desempenho acadêmico com base em dados
            históricos e tendências.
          </p>
          {/* Botão que chama a função para navegar e substituir a página */}
          <Link to="/prediction-form">
            <Button variant="primary" size="lg">
              Experimente Agora
            </Button>
          </Link>
        </section>

        {/* Carousel */}
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://www.meupositivo.com.br/doseujeito/wp-content/uploads/2022/03/14-dicas-e-ferramentas-uteis-para-estudar-online.jpg"
              alt="Primeira Slide"
            />
            <Carousel.Caption>
              <h3>Análise de Resultados</h3>
              <p>
                Explore como suas notas e comportamento afetam seu sucesso
                acadêmico futuro.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://static.vecteezy.com/ti/fotos-gratis/p1/4525039-binario-codigo-fundo-abstrato-tecnologia-digital-binario-dados-e-seguro-dados-conceito-gratis-foto.jpg"
              alt="Segunda Slide"
            />
            <Carousel.Caption>
              <h3>Previsões Personalizadas</h3>
              <p>
                Receba previsões precisas e personalizadas com base em seus
                dados acadêmicos.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Container>
      <footer>
        <CustomFooter />
      </footer>
    </div>
  );
}

export default HomePage;
