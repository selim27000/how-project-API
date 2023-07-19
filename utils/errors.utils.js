export const registrationErrors = (err) => {
  let errors = { email: "", firstName: "", lastName: "", password: "" };

  if (err.message.includes("email"))
    errors.email = "L'adresse e-mail est incorrecte";

  if (err.message.includes("firstName"))
    errors.firstName = "Le champ 'prénom' est requis";

  if (err.message.includes("lastName"))
    errors.lastName = "Le champ 'nom de famille' est requis";

  if (err.message.includes("password"))
    errors.password =
      "Mot de passe invalide (8 caractères minimum)";

  if (err.code === 11000)
    errors.email = "Un compte comportant la même adresse e-mail existe déjà";

  return errors;
};
export const loginErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message.includes("email"))
    errors.email = "L'adresse e-mail est incorrecte";
  else if (err.message.includes("password"))
    errors.password = "Le mot de passe est incorrect";

  return errors;
};

export const apiaryErrors = (err) => {
  let errors = {
    ownerId: "",
    name: "",
    desc: "",
    address: "",
    color: "",
    companyId: "",
  };

  if (err.code === 11000) {
    if (err.message.includes("name"))
      errors.name = "Un autre de vos ruchers porte déjà ce nom";
  } else {
    if (err.message.includes("ownerId"))
      errors.ownerId = "L'identifiant du propriétaire est incorrect";

    if (err.message.includes("name"))
      errors.name = "Le nom donné au rucher est incorrect";

    if (err.message.includes("desc"))
      errors.desc = "La description donnée au rucher est incorrecte";

    if (err.message.includes("address"))
      errors.address = "L'adresse du rucher est incorrecte";

    if (err.message.includes("color"))
      errors.color = "La couleur est incorrecte";
  }

  return errors;
};

export const hiveErrors = (err) => {
  let errors = {
    ownerId: "",
    apiaryId: "",
    name: "",
    hiveType: "",
    swarm: "",
    serialNb: "",
    superNb: "",
  };

  if (err.code === 11000) {
    if (err.message.includes("name"))
      errors.name = "Une autre de vos ruches porte déjà ce nom";
  } else {
    if (err.message.includes("ownerId"))
      errors.ownerId = "L'identifiant du propriétaire est incorrect";

    if (err.message.includes("apiaryId"))
      errors.apiaryId = "L'identifiant du rucher est incorrect";

    if (err.message.includes("name"))
      errors.name = "Le nom donné à la ruche est incorrect";

    if (err.message.includes("hiveType"))
      errors.hiveType = "Le type de ruche demandé est incorrect";

    if (err.message.includes("serialNb"))
      errors.serialNb = "Le numéro de série est incorrect";

    if (err.message.includes("swarm"))
      errors.swarm = "Les informations sur l'essaim sont incorectes";

    if (err.message.includes("superNb"))
      errors.superNb = "Le nombre de hausses est incorrect";

    if (err.message.includes("frameCapacity"))
      errors.frameCapacity =
        "Le nombre de cadre pouvant être mis dans la ruche est incorrect";
  }

  return errors;
};

export const transhumanceErrors = (err) => {
  let errors = {
    sourceApiaryId: "",
    destApiaryId: "",
    hiveList: ""
  };

  if (err.message.includes("sourceApiaryId"))
    errors.sourceApiaryId = "L'identifiant du rucher source est incorrect";

  if (err.message.includes("apiaryId"))
    errors.destApiaryId = "L'identifiant du rucher de destination est incorrect";

  if (err.message.includes("hiveList"))
    errors.hiveList = "La liste de ruches fournies est invalide";

  return errors;
};

export const postErrors = (err) => {
  let errors = {
    posterId: "",
    title: "",
    content: "",
    image: "",
  };

  if (err.code === 11000) {
    if (err.message.includes("name"))
      errors.name = "Un de vos post pour cette ruche porte déjà ce nom";
  } else {
    if (err.message.includes("posterId"))
      errors.ownerId = "L'identifiant de l'utilisateur est incorrect";

    if (err.message.includes("title"))
      errors.apiaryId = "Le titre du post est incorrect";

    if (err.message.includes("content"))
      errors.name = "Le texte du post est incorrect";

    if (err.message.includes("image"))
      errors.hiveType = "L'image du post est incorrecte";
  }

  return errors;
};

export const sensorDataErrors = (err) => {
  let errors = {
    serialNb: "",
    humExt: "",
    humInt: "",
    soundExt: "",
    freq: "",
    tempExt: "",
    tempInt: "",
    weight: "",
  };

  return errors;
};

export const uploadErrors = (err) => {
  let errors = { type: "", size: "" };

  if (err.message.includes("format"))
    errors.type = "Le fichier n'a pas un format autorisé";
  else if (err.message.includes("large"))
    errors.size = "Le fichier excède 500ko";

  return errors;
};
