"use server";

export async function submitForm(formData: FormData) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  
  if (!accessKey) {
    return { success: false, message: "Konfiguration fehlt" };
  }

  // Wir stellen sicher, dass der Key wirklich im FormData ist
  formData.set("access_key", accessKey);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      // WICHTIG: Kein "Content-Type" Header manuell setzen, 
      // wenn man FormData verschickt! Der Browser/Server macht das selbst.
      body: formData,
    });

    // Zuerst prüfen: Ist die Antwort überhaupt JSON?
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await response.text();
      console.error("Web3Forms lieferte HTML statt JSON:", errorText.slice(0, 100));
      return { success: false, message: "Server antwortet falsch (HTML)" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch Fehler im Detail:", error);
    return { success: false, message: "Verbindungsfehler" };
  }
}