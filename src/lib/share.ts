/** Share targets used across the feed and reels. */
export function postUrl(postId: string) {
  return `${window.location.origin}/market/${postId}`;
}

export function shareTargets(url: string, text = "") {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text ? `${text} ` : "");
  return [{ id: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${t}${u}` }];
}

export async function nativeShare(url: string, text?: string): Promise<"shared" | "copied" | "cancelled"> {
  try {
    if (navigator.share) {
      await navigator.share({ url, text });
      return "shared";
    }
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "cancelled";
  }
}
