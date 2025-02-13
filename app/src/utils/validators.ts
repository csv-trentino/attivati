export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateCF(cf: string): boolean {
  // Check length
  if (cf.length !== 16) {
    console.log(`Lunghezza non valida ${cf.length}`);
    return false;
  }

  // BRTPPL 98 A 20 M208 Z
  // Extract parts
  const name = cf.slice(0, 6);
  const year = cf.slice(6, 8);
  const month = cf.slice(8, 9);
  const day = cf.slice(9, 11);
  const place = cf.slice(11, 15);
  const control = cf.slice(15, 16);

  // Check name
  if (!/^[A-Z]+$/.test(name)) {
    console.log(`Nome non valido '${name}'`);
    return false;
  }

  // Check year
  if (!/^\d+$/.test(year)) {
    console.log(`Anno non valido '${year}'`);
    return false;
  }

  // Check month
  if (!/^[ABCDEHLMPRST]$/.test(month)) {
    console.log(`Mese non valido '${month}'`);
    return false;
  }

  // Check day
  if (!/^\d+$/.test(day)) {
    console.log(`Giorno non valido '${day}'`);
    return false;
  }

  // Check place I874
  if (!/^[A-Z]\d{3}$/.test(place)) {
    console.log(`Luogo non valido '${place}'`);
    return false;
  }

  // Check control
  if (!/^[A-Z]$/.test(control)) {
    console.log(`Controllo non valido '${control}'`);
    return false;
  }

  return true;
}
