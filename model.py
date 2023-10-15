import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

train = pd.read_csv("data/Train.csv")
test = pd.read_csv("data/Test.csv")

# hide category from training data
x = train.drop(["type"], axis=1)
y = train["type"]
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=30)

# Text -> Count matrix
vectorizer = CountVectorizer()
x_train_counts = vectorizer.fit_transform(x_train["tweet"])

# Term-frequency * inverse document-frequency
tfidf_transform = TfidfTransformer()
x_train_tfidf = tfidf_transform.fit_transform(x_train_counts)

# Naive Bayes MultinominalNB
clf = Pipeline([
    ('vect', CountVectorizer()),
    ('tfidf', TfidfTransformer()),
    ('clf', MultinomialNB())])
clf = clf.fit(x_train["tweet"], y_train)

y_pred = clf.predict(x_test.tweet)

# unique, count = np.unique(y_pred, return_counts=True)
# plt.bar(unique, count)

print('Accuracy: %f' % accuracy_score(y_test, y_pred))

print(clf.predict({"violent", "Hundreds of thousands of panicked Gazans fleeing south in response to Israeli warnings struggled to find food and shelter on Saturday in an intensifying humanitarian crisis, with nearly half the population displaced and dwindling supplies of food, water and medicine. The Israeli military gave its clearest indication yet that its troops are preparing to invade the Gaza Strip, announcing that troops were preparing for “a significant ground operation,” as part of “an integrated and coordinated attack from the air, sea and land.” The vaguely worded announcement did not say when the assault would begin."}))