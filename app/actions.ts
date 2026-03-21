"use server";

export async function submitForm(formData: FormData) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  
  if (!accessKey) {
    return { success: false, message: "API Key fehlt in Vercel!" };
  }

  // Wir bauen die Daten sauber als URL-Parameter zusammen
  const object = Object.fromEntries(formData);
  object.access_key = accessKey;
  const json = JSON.stringify(object);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: json,
    });

    const result = await response.json();
    console.log("Web3Forms Antwort:", result);
    return result;
  } catch (error) {
    console.error("Fehler beim Senden:", error);
    return { success: false, message: "Verbindungsfehler" };
  }
}