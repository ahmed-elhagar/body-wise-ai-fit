
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  return password.length >= 6;
};

export const validateStep = (step: number, data: any) => {
  switch (step) {
    case 1:
      return data.email && data.password && validateEmail(data.email) && validatePassword(data.password);
    case 2:
      return data.age && data.gender && data.height && data.weight;
    case 3:
      return data.activity_level && data.health_goal;
    default:
      return true;
  }
};

export const mapBodyFatToBodyShape = (bodyFat: number, gender: string): string => {
  if (gender === 'male') {
    if (bodyFat < 10) return 'athletic';
    if (bodyFat < 15) return 'lean';
    if (bodyFat < 20) return 'average';
    if (bodyFat < 25) return 'above_average';
    return 'high';
  } else {
    if (bodyFat < 16) return 'athletic';
    if (bodyFat < 20) return 'lean';
    if (bodyFat < 25) return 'average';
    if (bodyFat < 30) return 'above_average';
    return 'high';
  }
};

export const isValidBodyShape = (bodyShape: string): boolean => {
  const validShapes = ['athletic', 'lean', 'average', 'above_average', 'high', 'ectomorph', 'mesomorph', 'endomorph'];
  return validShapes.includes(bodyShape);
};
