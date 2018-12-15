var ReplySchema = mongoose.Schema({
    userName: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    comment: { type: String, required: true },
    activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }
});

var Reply = mongoose.model('Reply', ReplySchema);


app.get('/reply/:objectid', function (req, res) {
    Reply
        .find({activity:req.params['objectid']})
        .populate('userName')
        .exec(
        function (err, e) {
        if (err) {
            return res.send(err);
        }
        return res.send(e);
});

app.post('/reply', function (req, res) {
    //前端save activity的_id，reply的時候就能直接找
          User
          .findOne({userName:req.body['userName']})
          .exec(function (err, result) {
          if (err) {
              return res.send(err);
          }
            var e = new Reply({
                userName: result._id,
                comment: req.body['comment'],
                activity: req.body.['ObjectId'] //_id
            });
            e.save(function (err) {
                if (err) {
                    res.send(err);
                }
              })
            })
          });
