function status(request, response) {
  response.status(200).json({ chave: "Endpoint de teste" });
}

export default status;
