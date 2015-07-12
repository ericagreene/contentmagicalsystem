__author__ = 'Thinker'

from wordpress_xmlrpc import Client, WordPressPost
from wordpress_xmlrpc.methods.posts import GetPosts, NewPost

def setup(url,username,token):
    wp = Client(url,username,token)
    return wp

def Fetch_Posts(self):
    # Connect to Word Press API
    wp=setup('https://hackingjournalismtest.wordpress.com/xmlrpc.php', 'contentmagicalsystem','aA9&cG^%wqSkd7MxHU@PYT72c&h')
    return wp.call(GetPosts())

def Publish_Post(title,body):
    # Connect to Word Press POST API
    obj=setup('https://hackingjournalismtest.wordpress.com/xmlrpc.php', 'contentmagicalsystem','aA9&cG^%wqSkd7MxHU@PYT72c&h')
    post = WordPressPost()

    if len(title) == 0 :
        raise("Cant Process the request")
        return "Empty title requested"

    if len(body) == 0:
        raise("Cant Process the request")
        return "Empty body requested"
    '''
    Future or Next in line
    Better data validations
    Have some other quality checks for non ascii charecters and valdiate unicode letters if required
    Request type validation (old vs new)
    check if title already exist and update postif required
    '''

    post.title=title
    post.content=body
    # Make post visible ,status should be  publish
    post.post_status = 'publish'

    # API call to push it to word press
    post.id=wp.call(NewPost(post))
    #return "Post created with id ",post.id
    return post.id