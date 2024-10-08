export function parseSummaryResponse(response: string) {
  try{
    const summary = {
      quickSummary: "",
      mainPoints: [],
      servicesOffered: [],
      analysis: [],
    };
  
    const summaryMatch = response.match(/<summary>([\s\S]*?)<\/summary>/);
    if (summaryMatch) summary.quickSummary = summaryMatch[1].trim();
  
    const mainPointsMatch = response.match(
      /<main_points>([\s\S]*?)<\/main_points>/
    );
    if (mainPointsMatch) {
      summary.mainPoints = mainPointsMatch[1]
        .split("\n")
        .map((point) => point.trim())
        .filter((point) => point.startsWith("-"))
        .map((point) => point.slice(1).trim()) as never;
    }
  
    const servicesMatch = response.match(
      /<services_offered>([\s\S]*?)<\/services_offered>/
    );
    if (servicesMatch) {
      summary.servicesOffered = servicesMatch[1]
        .split("\n")
        .map((service) => service.trim())
        .filter((service) => service.startsWith("-"))
        .map((service) => service.slice(1).trim()) as never;
    }
  
    const analysisMatch = response.match(/<analysis>([\s\S]*?)<\/analysis>/);
    if (analysisMatch) {
      summary.analysis = analysisMatch[1]
        .split("\n")
        .map((point) => point.trim())
        .filter((point) => point.startsWith("-"))
        .map((point) => point.slice(1).trim()) as never;
    }
  
    return summary;
  } catch (e) {
    console.error("client/chat-summary/helper: Error parsing summary response", e);
    throw e
  }
}
