"use server";

export async function submitForm(formData: FormData) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  
  if (!accessKey) {
    return { success: false, message: "Konfiguration fehlt" };
  }

  // Wir fügen den Key erst hier auf dem Server hinzu
  formData.append("access_key", accessKey);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, message: "Server-Fehler" };
  }
}