
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
