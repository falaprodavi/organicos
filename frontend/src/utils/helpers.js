export const slugify = (text) => {
  return text
    .toString()
    .normalize("NFD") // Normaliza caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/[^\w-]+/g, "") // Remove caracteres não alfanuméricos
    .replace(/--+/g, "-"); // Remove múltiplos hífens
};
