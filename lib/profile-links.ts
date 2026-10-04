const email = "dkgupta5000@gmail.com";

export const profileLinks = {
  email,
  emailHref: `mailto:${email}`,
  linkedin: "https://www.linkedin.com/in/codewithdeep",
  github: "https://github.com/deepakguptadev",
  /**
   * Public resume PDF, served from public/resume/. NEXT_PUBLIC_RESUME_URL
   * overrides it when the PDF is hosted elsewhere.
   */
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL || "/resume/deepak-gupta-resume.pdf",
} as const;
