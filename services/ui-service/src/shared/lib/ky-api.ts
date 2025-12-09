import ky from "ky"
const FETCH_TIMEOUT = 60_000

const api = ky.create({
  timeout: FETCH_TIMEOUT,
  retry: {
    limit: 3,
    methods: ["get", "post", "put", "delete"],
    statusCodes: [408, 500, 502, 503, 504, 401, 403],
    delay: (attemptCount) => {
      return 1000 * attemptCount
    },
  },
})

export default api
