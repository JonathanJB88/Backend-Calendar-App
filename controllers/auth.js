const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario existe con ese correo",
      });
    }
    usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    // Generar el JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res
      .status(201)
      .json({ ok: true, uid: usuario.id, name: usuario.name, token });
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).json({ ok: false, msg: "Contacte al administrador" });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese correo",
      });
    }

    // Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña Incorrecta",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.json({ ok: true, uid: usuario.id, name: usuario.name, token });
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).json({ ok: false, msg: "Contacte al administrador" });
  }
};

const revalidarToken = async (req, res = response) => {
  const { uid, name } = req;

  // Generar el JWT
  const token = await generarJWT(uid, name);

  res.json({ ok: true, token, uid, name });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
