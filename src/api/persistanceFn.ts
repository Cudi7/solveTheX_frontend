import { Data } from '@/interfaces/Data'

export const useFetch = async (url: string) => {
  try {
    const response = await fetch(url)
    const parsedData = await response.json()

    const { success } = parsedData
    const data: Data = parsedData.data

    return { success, data }
  } catch (error) {
    return { success: false, error }
  }
}

export const searchByID = async (url: string, id: string) => {
  try {
    const response = await fetch(`${url}${id}`)
    const parsedData = await response.json()

    const { success, error } = parsedData
    const data: Data = parsedData.data

    return { success, data, error }
  } catch (error) {
    return { success: false, error }
  }
}

export const deletePokemon = async (id: string, url: string) => {
  try {
    const response = await fetch(`${url}${id}`, {
      method: 'DELETE',
      body: id,
    })

    const data = await response.json()

    return data
  } catch (error) {
    return { success: false, error }
  }
}

export const editPokemon = async (url: string, updatedData: {}, id: string) => {
  try {
    const response = await fetch(`${url}${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify(updatedData),
    })

    const data = await response.json()

    return data
  } catch (error) {
    return { success: false, error }
  }
}

export const createPokemon = async (url: string, newPokemonData: {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(newPokemonData),
    })

    const data = await response.json()

    return data
  } catch (error) {
    return { success: false, error }
  }
}
