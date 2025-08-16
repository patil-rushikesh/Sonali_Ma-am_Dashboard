"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId.trim(),
          password: password.trim(),
        }),
        credentials: "include", // keep only if your API sets cookies
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Invalid credentials")
      }
      // Store username and login time as an object in localStorage
      if (typeof window !== "undefined") {
        const loginInfo = {
          username: userId.trim(),
          time: new Date().toISOString(),
        };
        localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
      }
      router.replace("/")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-8 rounded-2xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded bg-background"
            required
            autoFocus
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded bg-background"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 text-center">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2 rounded font-semibold disabled:opacity-70"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}
