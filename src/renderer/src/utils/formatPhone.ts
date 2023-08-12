export const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  // Defina sua lógica de formatação aqui, por exemplo, usando regex
  return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};