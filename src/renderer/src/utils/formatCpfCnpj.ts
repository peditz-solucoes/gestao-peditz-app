export function formatCPFOrCNPJ(input: string): string {
  const cleanInput = input.replace(/\D/g, '') // Remove todos os caracteres não numéricos

  if (cleanInput.length === 11) {
    // Formata como CPF (123.456.789-01)
    return cleanInput.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  } else if (cleanInput.length === 14) {
    // Formata como CNPJ (12.345.678/0001-01)
    return cleanInput.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  } else {
    // Tamanho de entrada inválido
    return input
  }
}