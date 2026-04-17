const AUTHORIZED_TECHNICAL_NEWS_ID = "808544541";



const KNOWN_TECHNICAL_NEWS_USERS = {

  "cristian.alarcon@itegperformance.com": {

    id: "808 544 541",

    role: "admin",

    name: "Cristian",

  },

  "nain.zuniga@itegperformance.com": {

    id: "808 544 541",

    role: "tecnico",

    name: "Nain",

  },

  "nain.zuñiga@itegperformance.com": {

    id: "808 544 541",

    role: "tecnico",

    name: "Nain",

  },

};



const normalizeIdValue = (value) => String(value || "").replace(/\D/g, "");



export const TECHNICAL_NEWS_ACCESS_ID = "808 544 541";



export const resolveTechnicalNewsUserMeta = (user) => {

  const email = user?.email?.toLowerCase().trim() || "";

  const mappedUser = KNOWN_TECHNICAL_NEWS_USERS[email];

  const detectedId =

    user?.employeeId ||

    user?.documentId ||

    user?.idNumber ||

    user?.techRepairId ||

    user?.profile?.employeeId ||

    user?.profile?.documentId ||

    user?.uid ||

    "";



  return {

    email,

    mappedUser,

    normalizedDetectedId: normalizeIdValue(detectedId),

    normalizedKnownId: normalizeIdValue(mappedUser?.id),

    displayId: mappedUser?.id || detectedId || TECHNICAL_NEWS_ACCESS_ID,

  };

};



export const canAccessTechnicalNews = (user, role) => {

  const normalizedRole = String(role || user?.role || "").toLowerCase().trim();

  const { mappedUser, normalizedDetectedId, normalizedKnownId } = resolveTechnicalNewsUserMeta(user);



  const hasAuthorizedRole = normalizedRole === "admin" || normalizedRole === "tecnico";

  if (!hasAuthorizedRole) return false;



  const idMatches =

    normalizedKnownId === AUTHORIZED_TECHNICAL_NEWS_ID ||

    normalizedDetectedId === AUTHORIZED_TECHNICAL_NEWS_ID;



  if (!idMatches) return false;



  if (!mappedUser) {

    return true;

  }



  return mappedUser.role === normalizedRole;

};