const email = "dkgupta5000@gmail.com";

export const profileLinks = {
  email,
  emailHref: `mailto:${email}`,
  linkedin: "https://www.linkedin.com/in/codewithdeep",
  /**
   * Public resume PDF. Not supplied yet, so this is null unless
   * NEXT_PUBLIC_RESUME_URL is set; UIs then offer a mailto request instead.
   */
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL || null,
  resumeRequestHref: `mailto:${email}?subject=${encodeURIComponent("Resume request")}`,
} as const;
