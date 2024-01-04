export const TOKEN_KEY = '@Peditz-gestao-token-02'
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const getUser = () => JSON.parse(localStorage.getItem('user') || '{}')

interface User {
  email: string
  first_name: string
  last_name: string
}

export const setLogin = (token: string, user: User) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem('user', JSON.stringify(user))
}

export const setLogout = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem('user')
}
