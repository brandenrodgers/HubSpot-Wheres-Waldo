import express from "express";

const router = new express.Router();

router.get("/waldo", (req, res) => {
  console.log(req.query);
  res.send({
    results: [
      {
        objectId: 123,
        title: "Where's Waldo",
        waldo: "Not here!",
        properties: [
          {
            label: "Clue",
            dataType: "STRING",
            value: "He is somewhere else",
          },
        ],
      },
    ],
  });
});

export default router;
