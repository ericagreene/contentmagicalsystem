__author__ = 'Thinker'
import json
from pprint import pprint
from wordpress_xmlrpc import Client, WordPressPost
from wordpress_xmlrpc.methods.posts import GetPosts, NewPost

def setup(url,username,token):
    wp = Client(url,username,token)
    return wp

def Fetch_Posts(self):
    # Connect to Word Press API
    wp=setup('https://hackingjournalismtest.wordpress.com/xmlrpc.php', 'contentmagicalsystem','aA9&cG^%wqSkd7MxHU@PYT72c&h')
    print(wp.call(GetPosts()))

def Publish_Post(wp,request):
    # Connect to Word Press POST API
    post = WordPressPost()

    json_data = json.loads(request)
    # Title , Content mandatory fields
    post.title = request['summary']
    post.content = request['body']
    '''
    # Render the images
    for photo in request['photo']:
        post.content += "<img>"+photo+"</img>"

    post.title = 'New line Test Paragraph Test New 2'
    post.content="<p>Hello and welcome to The Post.<p>" \
                     "<p>We wanted to provide <br/> some of our data for you to hack on.<p>"

    '''
    # Make post visible ,status should be  publish
    post.post_status = 'publish'
    if (len(post.title) == 0 and len(post.content) == 0):
        raise("Cant Process the request")
        return "Invalid JSON object requested"

    # API call to push it to word press
    post.id=wp.call(NewPost(post))
    return "Post created with id ",post.id

# Some test
jsonresp=[""]
obj=setup('https://hackingjournalismtest.wordpress.com/xmlrpc.php', 'contentmagicalsystem','aA9&cG^%wqSkd7MxHU@PYT72c&h')
res=Publish_Post(obj,jsonresp)
print(res)