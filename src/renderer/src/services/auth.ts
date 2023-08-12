export const TOKEN_KEY = '@Peditz-gestao-token'
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null
export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setLogin = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const setLogout = () => {
  localStorage.removeItem(TOKEN_KEY)
}
