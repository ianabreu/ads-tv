export function generateSlug(text: string): string {
  return text
    .toString() // Garante que o valor seja uma string
    .normalize("NFD") // Normaliza a string decompondo caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
    .toLowerCase() // Converte para letras minúsculas
    .trim() // Remove espaços em branco no início e no fim
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres inválidos
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-");
}
