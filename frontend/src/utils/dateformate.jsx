export const formatDate = (d) => {
  d = new Date(d);
  const pad = n => String(n).padStart(2, '0');
  let h = d.getHours(), ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${pad(h)} : ${pad(d.getMinutes())} ${ampm} ${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`;
};
//${pad(d.getSeconds())}