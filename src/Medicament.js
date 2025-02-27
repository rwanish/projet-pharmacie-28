export default class Medicament {
  constructor(id, denomination, qte, formepharmaceutique, photo) {
    this._id = id;
    this._denomination = denomination;
    this._qte = qte;
    this._formepharmaceutique = formepharmaceutique;
    this._photo = photo;
  }

  get id() {
    return this._id;
  }
  get denomination() {
    return this._denomination;
  }

  get qte() {
    return this._qte;
  }

  get formepharmaceutique() {
    return this._formepharmaceutique;
  }

  get photo() {
    return this._photo;
  }

  set denomination(nouveauNom) {
    this._denomination = nouveauNom;
  }

  set qte(nouvelleQte) {
    this._qte = nouvelleQte;
  }
  set formepharmaceutique(nouvelleForme) {
    this._formepharmaceutique = nouvelleForme;
  }

  set photo(nouvellePhoto) {
    this._photo = nouvellePhoto;
  }

  pourAfficher() {
    return `Médicament: ${this._denomination}, Quantité: ${this._qte}, Forme: ${this._formepharmaceutique}, Photo: ${this._photo}`;
  }
}
