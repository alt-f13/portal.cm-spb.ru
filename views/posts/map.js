function(doc) {
  if (doc.type == "post") {
    emit(doc.date, {
      id: doc._id,
      date: doc.date,
      title: doc.title,
      tags: doc.tags,
      body: doc.body.replace(/(<([^>]+)>)/ig,"").substring(0,600),
      logo: doc.logo,
      published: doc.published
    });
  }
};
