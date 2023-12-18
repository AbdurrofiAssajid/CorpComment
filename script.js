// -- GLOBAL --
const textareaEl = document.querySelector('.form__textarea')
const counterEl = document.querySelector('.counter')
const formEl = document.querySelector('.form')
const feedbackEl = document.querySelector('.feedbacks')
const submitBtnEl = document.querySelector('.submit-btn')
const spinnerEl = document.querySelector('.spinner')
const hashtagsEl = document.querySelector('.hashtags')
const BASE_API_URL = 'https://bytegrad.com/course-assets/js/1/api'
const maxNumber = 150
const minNumber = 7



// -- RENDER FEEDBACK --
    const renderFeedback = feedback => {
        const feedbackItemHTML =
            ` <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${feedback.upvoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${feedback.badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${feedback.company}</p>
                <p class="feedback__text">${feedback.text}</p>
            </div>
            <p class="feedback__date">${feedback.daysAgo === 0 ? 'NEW' : `${feedback.daysAgo}d`}</p>
        </li> `
    
        feedbackEl.insertAdjacentHTML('beforeend', feedbackItemHTML)
    
    }



//  -- WORD COUNTER COMPONENT --

(() => {
    const inputHandler = () => {
        const characters = textareaEl.value.length
        const resultCharacters = maxNumber - characters
        counterEl.textContent = resultCharacters
    }
    
    textareaEl.addEventListener('input', inputHandler)
})();




// -- FORM COMPONENT --

(() => {

    const formHandler = e => {
        e.preventDefault()
        const text = textareaEl.value
    
        //logic alert
        const alertNotif = alertCheck => {
            const alertValidate = alertCheck === 'valid' ? window.alert('Do you really want to add it') : window.alert('The text must must be included # and at least 7 characters')
        }
    
        //logic validation
        const validation = textCheck => {
            const className = textCheck === 'valid' ? 'form--valid' : 'form--invalid'
            formEl.classList.add(className)
            setTimeout(() => {
                formEl.classList.remove(className)
            }, 4000)
        }
    
        if (text.includes('#') && text.length >= minNumber) {
            validation('valid')
            alertNotif('valid')
    
        } else {
            validation('invalid')
            alertNotif('invalid')
    
    
            textareaEl.focus()
            return
        }
    
        const hastag = text.split(' ').find(word => word.includes('#'))
        const company = hastag.substring(1)
        const badgeLetter = company.substring(0, 1).toUpperCase()
        const upvoteCount = 0
        const daysAgo = 0
    
        const feedback = {   // -- if the value of variable is the same name with the variable itself then we can summarize it--
            upvoteCount,
            badgeLetter,
            daysAgo,
            company,
            text
    
        }
        renderFeedback(feedback)
    
        fetch(`${BASE_API_URL}/feedbacks`, {
            method: 'POST',
            body: JSON.stringify(feedback),
            headers: {
                Accept: 'applicaton/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (!res.ok) {
                console.log('Something went wrong')
                return
            }
            console.log('Successfully submitted')
    
        }).catch(err => console.log(err)) // its return by default if we're not using {} in function
    
    
        //reload page
        textareaEl.value = ''
    
        //blur submit button
        submitBtnEl.blur();
    
        //reset counter
        counterEl.textContent = maxNumber
    }
    
    formEl.addEventListener('submit', formHandler)
})();



// -- Feedback components --

(() => {
    const clickHandler = e => {
        const clickedEl = e.target
    
        const upvoteIntention = clickedEl.className.includes('upvote')
    
        if (upvoteIntention) {
            const upvoteBtnEl = clickedEl.closest('.upvote')
    
            upvoteBtnEl.disabled = true
    
            const upvoteCountEl = upvoteBtnEl.querySelector('.upvote__count') //  the output is string cause we took it from HTML
    
            let upvoteCount = +upvoteCountEl.textContent      // add + infrontof the value and it will assign to number
    
            upvoteBtnEl.textContent = ++upvoteCount
        } else {
            clickedEl.closest('.feedback').classList.toggle('feedback--expand')
        }
    }
    feedbackEl.addEventListener('click', clickHandler)
    
    
    
    fetch(`${BASE_API_URL}/feedbacks`)
        .then(res => {
            return res.json()
            
        }).then(data => {
            spinnerEl.remove()
            data.feedbacks.forEach(element => renderFeedback(element))
    
        }).catch(err => {
            feedbackEl.textContent = `something went wrong while fetching the data, ${err}`
    
        })

})();



    // -- HASHTAG COMPONENT --

(() => {
    const hashtagsHandler = e => {
       const hashtagsClickEl = e.target
       
       if(hashtagsClickEl.className === 'hashtags') return

       const companyFromHashtags = hashtagsClickEl.textContent.substring(1).toLowerCase().trim()

       feedbackEl.childNodes.forEach(childNode => {

           if(childNode.nodeType === 3) return

           const companyFromFeedback = childNode.querySelector('.feedback__company').textContent.toLowerCase().trim()
   
           if(companyFromHashtags !== companyFromFeedback) {
               childNode.remove()
           }

           
       })   
    }
   hashtagsEl.addEventListener('click',hashtagsHandler)

})();