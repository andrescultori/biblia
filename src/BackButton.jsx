import React from 'react';
import { goBack } from './route.js';

// Botão Voltar do cabeçalho das páginas (livro, linha do tempo, personagens): volta à página anterior do app.
export default function BackButton({ t }) {
  return <button type="button" className="ghost back" onClick={goBack}>← {t.back}</button>;
}
