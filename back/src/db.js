// back/src/db.js
import sqlite from 'sqlite'
import SQL from 'sql-template-strings';

// back/src/db.js
const initializeDatabase = async () => {

  const db = await sqlite.open('./db.sqlite');
  

  const addPhoto = async (props) => {

    const { name, amount, age } = props
    try{
      const result = await db.run(SQL`INSERT INTO photo (name,amount,age) VALUES (${name}, ${amount},${age})`);
      const id = result.stmt.lastID
      return id
    }catch(e){
      throw new Error(`couldn't insert this combination: `+e.message)
    }
  }
  
  const deletePhoto = async (id) => {
    try{
      const result = await db.run(SQL`DELETE FROM photo WHERE id = ${id}`);
      if(result.stmt.changes === 0){
        throw new Error(`photo "${id}" does not exist`)
      }
      return true
    }catch(e){
      throw new Error(`couldn't delete the photo "${id}": `+e.message)
    }
  }
  
  const updatePhoto = async (id, props) => {

    const { name, amount, age } = props;
    try {
      let statement = "";
        statement = SQL`UPDATE photo SET  name=${name} , amount=${amount} , age = ${age} WHERE id = ${id}`;
      const result = await db.run(statement);
      if (result.stmt.changes === 0) {
        throw new Error(`no changes were made`);
      }
      return true;
    } catch (e) {
      throw new Error(`couldn't update the photo ${id}: ` + e.message);
    }
  }


  const getPhoto = async (id) => {
    try{
      const photoList = await db.all(SQL`SELECT  * FROM photo WHERE id = ${id}`);
      const photo = photoList[0]
      return photo
    }catch(e){
      throw new Error(`couldn't get the photo ${id}: `+e.message)
    }
  }
  
  const getAllphotos = async (orderBy) => {
    try{
      
      let statement = `SELECT * FROM photo`
      switch(orderBy){
        case 'amount': statement+= ` ORDER BY amount`; break;
        case 'age': statement+= ` ORDER BY age`; break;
        default: break;
      }
      const rows = await db.all(statement)
      if(!rows.length){
        throw new Error(`no rows found`)
      }
      return rows
    }catch(e){
      throw new Error(`couldn't retrieve photos: `+e.message)
    }
  }
  
  const controller = {
    addPhoto,
    deletePhoto,
    updatePhoto,
    getPhoto,
    getAllphotos
  }

  return controller
}


export default initializeDatabase

