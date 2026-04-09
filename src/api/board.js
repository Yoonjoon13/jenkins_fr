const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(
  /\/$/,
  '',
)

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, init) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    let message = 'Request failed.'
    const rawText = await response.text()

    try {
      const data = JSON.parse(rawText)
      message =
        typeof data.message === 'string'
          ? data.message
          : typeof data.detail === 'string'
            ? data.detail
            : typeof data.title === 'string'
              ? data.title
              : message
    } catch {
      if (rawText) {
        message = rawText
      }
    }

    throw new ApiError(message, response.status)
  }

  return response.json()
}

export function fetchBoardList() {
  return request('/board/list')
}

export function fetchBoardDetail(idx) {
  return request(`/board/${idx}`)
}

export function createBoardPost(payload) {
  return request('/board/reg', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
