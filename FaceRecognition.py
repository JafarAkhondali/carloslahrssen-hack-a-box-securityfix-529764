
# coding: utf-8

# In[3]:


import json
from clarifai.rest import ClarifaiApp
import numpy as np
import os
import re
import sys


# In[4]:


os.environ["CLARIFAI_API_KEY"] = "cde1899c377b4ad3827788d69eaa6ef8"


# In[5]:


app = ClarifaiApp()
model = app.models.get("d02b4508df58432fbb84e800597b8959")


# In[11]:


photo1 = sys.argv[1]
print(photo1)
photo2 = sys.argv[2]
print(photo2)


# In[7]:


def getEmbedding(image_url):
    # Call the Face Embedding Model
    jsonTags = model.predict_by_url(url=image_url)

    # Storage for all the vectors in a given photo
    faceEmbed = []

    # Iterate through every person and store each face embedding in an array
    for faces in jsonTags['outputs'][0]['data']['regions']:
        for face in faces['data']['embeddings']:
            embeddingVector = face['vector']
            faceEmbed.append(embeddingVector)
    return faceEmbed[0]


# In[8]:


# Get embeddings and put them in an array format that Numpy can use
photo1Embedding = np.array(getEmbedding(photo1))
photo2Embedding = np.array(getEmbedding(photo2))


# In[23]:


# Get Distances useing Numpy
photoDistance = np.linalg.norm(photo2Embedding-photo1Embedding)

def isSimilar(distance):
    if distance <= .8:
        print ("true")
    else:
        print ("false")

isSimilar(photoDistance)
print(photoDistance)
