import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="container">
      <h1>Acesso Não Autorizado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <Link to="/" className="btn btn-primary">
        Voltar para a página inicial
      </Link>
    </div>
  );
};

export default Unauthorized;
