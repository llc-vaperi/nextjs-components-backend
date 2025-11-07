//path:/api/
//description: testFunc
export const firstFunc = (req, res) => {
  try {
    res.json("new server is started ");
  } catch (error) {
    console.log(error);
  }
};
