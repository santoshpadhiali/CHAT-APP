import monogos from "mongoose"

export  const connectDB = async () => {


    try {
     const conn= await monogos.connect(process.env.DB_URL)
     console.log(`mongo connection : ${conn.connection.host} `);
     
        
    } catch (error) {
        console.log("database connection error  error " , error);
        
    }
}