import { IAction } from "@fullstackcraftllc/codevideo-types";

export const silvanExample: Array<IAction> = [
  {
    "name": 'file-explorer-create-file',
    "value": 'src/hi-silvan.xaml'
  },
  {
    "name": 'file-explorer-open-file',
    "value": 'src/hi-silvan.xaml'
  },
  {
    "name": "author-speak-before",
    "value": "Hi Silvan. I just wanted to say I'm pretty sure your the best software engineer I've ever met in my life, truly. Haaa... That sounded sarcastic... but just trust me. It's hard to express myself with this crappy google speech synthesis API."
  },
  {
    "name": "author-speak-before",
    "value": "It's been a pleasure to work with you on the Compremium project. I think we've made absolutely crazy progress. Let's keep it up!"
  },
  {
    "name": "author-speak-before",
    "value": "But enough talk. Its time to write some code! As you can see here, I've got an axeaml file prepared... That's right, you guessed it... it's time to write... SOME WPF!!!"
  },
  {
    "name": "editor-type",
    "value": `<Window x:Class="MyWPFApp.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="My First WPF App" Height="450" Width="800">
    
    <Grid>
        <StackPanel VerticalAlignment="Center" HorizontalAlignment="Center">
            <TextBlock 
                Text="Welcome to WPF!"
                FontSize="24"
                Margin="0,0,0,20"/>
            
            <Button 
                Content="Click Me!"
                Width="100"
                Height="30"
                Click="Button_Click"/>
            
            <TextBlock 
                x:Name="ResultText"
                Text=""
                FontSize="16"
                Margin="0,20,0,0"/>
        </StackPanel>
    </Grid>
</Window>`
  },
  {
    "name": "author-speak-before",
    "value": "Now, I know this looks like Chat GPT or some shit. But I can assure you its 100% deterministic event sourcing for the I-D-E! Yes that's right folks, we love uncle bob!"
  },
  {
    "name": "author-speak-before",
    "value": "But... oh my god, how could I forget the code behind file?! Jonathan, or der Burtscher, would rage at me... Let's make the code behind file immediately..."
  },
  {
    "name": 'file-explorer-create-file',
    "value": 'src/hi-silvan.xaml.cs'
  },
  {
    "name": 'file-explorer-open-file',
    "value": 'src/hi-silvan.xaml.cs'
  },
  {
    "name": "editor-type",
    "value": `using System.Windows;

namespace MyWPFApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            ResultText.Text = "Button was clicked!";
        }
    }
}`
  },
  {
    "name": 'author-speak-before',
    "value": 'Thank god! I nearly forgot it... but now all is well'
  },
  {
    "name": 'author-speak-before',
    "value": "Anyways, if I don't see you sooner, I'll see you on Thursday for the Go presentation... and go go go GU ARE ANNI?!? Wow... google speech synthesis really is shit... oh man"
  },
]