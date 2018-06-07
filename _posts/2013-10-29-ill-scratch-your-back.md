---
categories: article

date: 2013-10-29 00:10:00

title: I’ll Scratch Your Back, And Mine Too
lede: I’ve been playing around with CSS content and attribute selectors recently, and came across a useful trick for styling default elements.
tags:
- css
- tutorials

banner:
- ill-scratch-your-back.png
banner_mobile:
- ill-scratch-your-back_mobile.png

edit_date: 2015-06-06 20:20:00
edit_text: I have revised this technique and its explanation since originally penning this article. You can jump to the updated article, <a href="{% post_url 2015-06-08-backscratching-revisited %}">Backscratching Revisited</a>, or continue reading.

caniuse: true
shorturl: 82n3v

syndication:
- https://twitter.com/iamchrisburnell/status/395115858814840833
---


When building a site for a client who isn’t very tech-savvy, it’s important that they’re able to publish their content with the variety of options to style and format their text that are available on the web, usually in the form of a <abbr title="What You See Is What You Get">WYSIWYG editor</abbr>, which saves them the trouble of learning how to write HTML (and retain that knowledge). As a web developer, it’s then important that the CSS we write matches the output of the editor’s content. Fortunately, most of the time the editor will spit out plain old HTML with all the normal tags you’re used to.

So, for example, if an editor creates an article with lists and pictures, it’s important that our code doesn’t mistake these basic elements for something else, and apply extra styles which we’re trying to apply to a smaller subset of the given element, which we usually denote with a <dfn title="A class is a label which is assigned to element(s) to distinguish it from like elements.">class</dfn>.


{% include content/heading.html title='Let’s look at some code' id='lets-look-at-some-code' %}

Say we want the default ordered list to appear with `padding-left` and `list-style` that differ from the user agent stylesheet ([a whole other ballgame](https://necolas.github.io/normalize.css/ "Normalize.css"){:rel="external"}). We also have a table of contents for our template, which we’ll also use an ordered list to mark up in HTML.

{% highlight html %}
<ol class="table-of-contents">
    <li>Chapter 1</li>
    <li>Chapter 2</li>
</ol>
{% endhighlight %}

And the CSS:

{% highlight css %}
ol {
padding-left: 4em;
    list-style: outside decimal-leading-zero;
}
/* overqualified selector only for example: */
ol.table-of-contents {
    padding-left: 0;
    list-style: none;
    margin-bottom: 1em;
}
{% endhighlight %}

Due to the cascading nature of CSS, the styles we’ve given to our default ordered list will *cascade* to our table of contents! As a result, we have to *unset* the `padding-left` and `list-style` we *just* applied. This is a waste of precious code!


--------


In experimenting with CSS content and attribute selectors, I’ve discovered a neat trick to apply styles to elements **without** a class, with the caveat that you’re styling the rest of the elements **with** classes. In my opinion, this is best practice anyway as part of a movement towards a modular approach to CSS.


{% include content/heading.html title='So here it is:' id='here-it-is' %}

{% highlight css %}
ol:not([class]) {
    padding-left: 4em;
    list-style: outside decimal-leading-zero;
}
{% endhighlight %}


{% include content/heading.html title='What’s going on here?' %}

We’re saying that <q>for every ordered list that doesn’t have a class attribute, apply some styles.</q> Normally, the attribute selector, `[ ]`, is used to style external links or elements with a specific `rel` attribute, but in this case we’re using the barebones and **only** checking for the instance of a class attribute at all.

Normally in CSS, we would use `.` to target an element by *class name*, but we can also use an attribute selector: `[class=table-of-contents]`. This will match elements with the class, `table-of-contents`, but what’s nice about CSS3’s attribute selectors is that they can be used like a boolean to check for the attribute’s (or multiple attributes’) existence only.


--------


In this way, we’re able to style some default elements that a content editor would output onto a page without having to *repeatedly un-style* them later on where they’re not needed. This technique has broad support—everything except IE8 and older works just fine, but, as always, check [Can I Use](http://caniuse.com/#search=css-sel3 "Can I Use - CSS3 selectors"){:rel="external"} for the specifics.

{% include content/caniuse.html feature='css-sel3' %}


--------


If you have any comments or performance notes about this, please let me know in the [comments below](#comments) or [on twitter](https://twitter.com/iamchrisburnell).
