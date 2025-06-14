
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatTooltip = (value: any, name: string) => {
  if (name === 'value') return [`${value} kg`, 'Weight'];
  if (name === 'target') return [`${value} kg`, 'Target'];
  if (name === 'consumed') return [`${value} kcal`, 'Consumed'];
  if (name === 'burned') return [`${value} kcal`, 'Burned'];
  if (name === 'duration') return [`${value} min`, 'Duration'];
  return [value, name];
};
