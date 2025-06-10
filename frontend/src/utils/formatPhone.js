// utils/formatPhone.js
export const formatPhoneNumber = (value) => {
  if (!value) return "";

  // Remove tudo que não é dígito
  const cleaned = value.replace(/\D/g, "");

  // Limita a 11 caracteres (máximo para telefone brasileiro)
  const limited = cleaned.slice(0, 11);

  // Aplica a formatação
  if (limited.length <= 10) {
    return limited.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, "($1) $2-$3").trim();
  } else {
    return limited.replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, "($1) $2-$3").trim();
  }
};
