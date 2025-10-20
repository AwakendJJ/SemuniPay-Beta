"use server"

const PRETIUM_API_KEY =  import.meta.env.VITE_PRETIUM_API_KEY;

export async function fetchExchangeRate(currencyCode = "ETB") {
  const url = "https://pretium-api-proxy.onrender.com/api/v1/exchange-rate/"
  const data = { currency_code: currencyCode }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": PRETIUM_API_KEY || "",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    const buying_rate = Number.parseFloat(result.data.buying_rate)
    return { success: true, rate: buying_rate }
  } catch (error) {
    console.error("Error fetching exchange rate:", error)
    return { success: false, rate: 0, error: "Failed to fetch exchange rate" }
  }
}

export async function submitPayment(paymentData: {
  transaction_hash: string
  amount: number
  shortcode: string
  mobile_network: string
  chain: "BASE"
}) {
  try {
    const response = await fetch("https://pretium-api-proxy.onrender.com/api/v1/pay/ETB", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": PRETIUM_API_KEY || "",
      },
      body: JSON.stringify(paymentData),
    })

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error("Payment submission failed:", error)
    return { success: false, error: "Failed to submit payment" }
  }
}
