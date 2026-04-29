export const getContactPageQuery = `
  *[_type == "contactPage"][0] {
    "address": coalesce(address[$locale], address.en),
    email,
    phone,
    "workingHours": coalesce(workingHours[$locale], workingHours.en),
    socialLinks[] {
      platform,
      url
    }
  }
`
