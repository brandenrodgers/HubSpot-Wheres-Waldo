import express from "express";

const router = new express.Router();

router.get("/waldo", (req, res) => {
  res.send({
    results: [
      {
        objectId: 123,
        title: "Where's Waldo",
        waldo: `He's not hiding with ${req.query.firstname}!`,
        properties: [
          {
            label: "Clue",
            dataType: "STRING",
            value: "He is somewhere else...",
          },
        ],
      },
    ],
  });
});

export default router;
