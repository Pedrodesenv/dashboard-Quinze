import axios from 'axios';

// A URL deve terminar exatamente no /exec
export const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzknzIMgW87yY1g3IgSoRmSSuRQ1vGpN_cJOA3uy8Q7wPnvtI2BZfUqUF0rkcMxW250ug/exec";

export const api = axios.create({
  baseURL: GOOGLE_SHEETS_URL,
  // Isso aqui ajuda a evitar o erro de CORS do Google
  headers: {
    'Content-Type': 'text/plain;charset=utf-8',
  },
});