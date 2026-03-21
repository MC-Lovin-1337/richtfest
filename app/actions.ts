"use server";

export async function submitForm(formData: FormData) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  
  console.log("Check AccessKey Status:", accessKey ? "✅ Gefunden" : "❌ FEHLT!");

  if (!accessKey) {
    return { success: false, message: "Konfiguration fehlt" };
  }

  formData.append("access_key", accessKey);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
    
    const result = await response.json();
    
    // --- DIESE ZEILE HIER ZEIGT UNS DEN ECHTEN GRUND IM VERCEL LOG ---
    console.log("Web3Forms Server Antwort:", JSON.stringify(result));
    // ---------------------------------------------------------------

    return result;
  } catch (error) {
    console.error("Fetch Fehler:", error);
    return { success: false, message: "Server-Fehler" };
  }
}