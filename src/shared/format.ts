/** 1518 -> "1.518" (dấu chấm phân cách hàng nghìn kiểu Việt Nam). */
export const num = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const usd = (n: number) => `$${num(n)}`;
